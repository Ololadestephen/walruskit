module recoverkit::capsule {
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    const EInvalidThreshold: u64 = 1;
    const ENotOwner: u64 = 2;
    const ENotBeneficiary: u64 = 3;
    const ENotGuardian: u64 = 4;
    const ERecoveryAlreadyRequested: u64 = 5;
    const ERecoveryNotRequested: u64 = 6;
    const EAlreadyApproved: u64 = 7;
    const ECancelled: u64 = 8;
    const EOwnerStillActive: u64 = 9;

    public struct Capsule has key, store {
        id: UID,
        owner: address,
        beneficiary: address,
        guardians: vector<address>,
        threshold: u16,
        heartbeat_timeout_ms: u64,
        final_delay_ms: u64,
        blob_id: vector<u8>,
        blob_hash: vector<u8>,
        blob_size: u64,
        created_at_ms: u64,
        last_heartbeat_at_ms: u64,
        recovery_requested_at_ms: u64,
        cancelled: bool,
        approved_guardians: vector<address>,
    }

    public struct CapsuleCreated has copy, drop {
        capsule: address,
        owner: address,
        beneficiary: address,
        threshold: u16,
        blob_size: u64,
    }

    public struct HeartbeatSent has copy, drop {
        capsule: address,
        owner: address,
        timestamp_ms: u64,
    }

    public struct RecoveryRequested has copy, drop {
        capsule: address,
        beneficiary: address,
        timestamp_ms: u64,
    }

    public struct GuardianApproved has copy, drop {
        capsule: address,
        guardian: address,
        approval_count: u64,
    }

    public struct RecoveryCancelled has copy, drop {
        capsule: address,
        owner: address,
    }

    public fun create_capsule(
        beneficiary: address,
        guardians: vector<address>,
        threshold: u16,
        heartbeat_timeout_ms: u64,
        final_delay_ms: u64,
        blob_id: vector<u8>,
        blob_hash: vector<u8>,
        blob_size: u64,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let guardian_count = vector::length(&guardians);
        assert!(threshold > 0 && (threshold as u64) <= guardian_count, EInvalidThreshold);

        let owner = tx_context::sender(ctx);
        let now = clock::timestamp_ms(clock);
        let capsule = Capsule {
            id: object::new(ctx),
            owner,
            beneficiary,
            guardians,
            threshold,
            heartbeat_timeout_ms,
            final_delay_ms,
            blob_id,
            blob_hash,
            blob_size,
            created_at_ms: now,
            last_heartbeat_at_ms: now,
            recovery_requested_at_ms: 0,
            cancelled: false,
            approved_guardians: vector[],
        };

        event::emit(CapsuleCreated {
            capsule: object::uid_to_address(&capsule.id),
            owner,
            beneficiary,
            threshold,
            blob_size,
        });

        transfer::share_object(capsule);
    }

    public fun heartbeat(capsule: &mut Capsule, clock: &Clock, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == capsule.owner, ENotOwner);
        let now = clock::timestamp_ms(clock);
        capsule.last_heartbeat_at_ms = now;
        event::emit(HeartbeatSent { capsule: object::uid_to_address(&capsule.id), owner: sender, timestamp_ms: now });
    }

    public fun request_recovery(capsule: &mut Capsule, clock: &Clock, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == capsule.beneficiary, ENotBeneficiary);
        assert!(!capsule.cancelled, ECancelled);
        assert!(capsule.recovery_requested_at_ms == 0, ERecoveryAlreadyRequested);
        let now = clock::timestamp_ms(clock);
        assert!(now >= capsule.last_heartbeat_at_ms + capsule.heartbeat_timeout_ms, EOwnerStillActive);
        capsule.recovery_requested_at_ms = now;
        capsule.approved_guardians = vector[];
        event::emit(RecoveryRequested { capsule: object::uid_to_address(&capsule.id), beneficiary: sender, timestamp_ms: now });
    }

    public fun approve_recovery(capsule: &mut Capsule, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(capsule.recovery_requested_at_ms > 0, ERecoveryNotRequested);
        assert!(!capsule.cancelled, ECancelled);
        assert!(contains(&capsule.guardians, sender), ENotGuardian);
        assert!(!contains(&capsule.approved_guardians, sender), EAlreadyApproved);
        vector::push_back(&mut capsule.approved_guardians, sender);
        event::emit(GuardianApproved {
            capsule: object::uid_to_address(&capsule.id),
            guardian: sender,
            approval_count: vector::length(&capsule.approved_guardians),
        });
    }

    public fun cancel_recovery(capsule: &mut Capsule, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == capsule.owner, ENotOwner);
        assert!(capsule.recovery_requested_at_ms > 0, ERecoveryNotRequested);
        capsule.cancelled = true;
        event::emit(RecoveryCancelled { capsule: object::uid_to_address(&capsule.id), owner: sender });
    }

    public fun can_recover(capsule: &Capsule, clock: &Clock): bool {
        if (capsule.cancelled) return false;
        if (capsule.recovery_requested_at_ms == 0) return false;
        if (vector::length(&capsule.approved_guardians) < (capsule.threshold as u64)) return false;

        let now = clock::timestamp_ms(clock);
        let inactive = now >= capsule.last_heartbeat_at_ms + capsule.heartbeat_timeout_ms;
        let final_delay_passed = now >= capsule.recovery_requested_at_ms + capsule.final_delay_ms;

        inactive && final_delay_passed
    }

    fun contains(addresses: &vector<address>, needle: address): bool {
        let mut i = 0;
        let len = vector::length(addresses);
        while (i < len) {
            if (*vector::borrow(addresses, i) == needle) return true;
            i = i + 1;
        };
        false
    }
}
