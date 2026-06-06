import { DocsLayout } from "../../../../components/DocsLayout";

export default function GuardianPanelPage() {
  return (
    <DocsLayout
      active="guardian-panel"
      breadcrumb="@walruskit / Components / GuardianPanel"
      toc={[
        { href: "#overview", label: "Overview" },
        { href: "#checks", label: "Checks" },
        { href: "#approval", label: "Approval call" },
      ]}
    >
      <section id="overview" className="doc-section intro-section">
        <h1>GuardianPanel</h1>
        <p className="lead">
          GuardianPanel lets a guardian understand a recovery request, check whether their wallet is
          eligible, and prepare the Sui approval transaction.
        </p>
      </section>

      <section id="checks" className="doc-section">
        <h2>Checks</h2>
        <div className="docs-table">
          <div>
            <span>Eligibility</span>
            <p>Confirms the connected wallet is one of the capsule guardians.</p>
          </div>
          <div>
            <span>Request state</span>
            <p>Shows whether the beneficiary has already started recovery.</p>
          </div>
          <div>
            <span>Approval state</span>
            <p>Prevents duplicate approvals and shows current threshold progress.</p>
          </div>
        </div>
      </section>

      <section id="approval" className="doc-section">
        <h2>Approval call</h2>
        <pre><code>{`const approval = walruskit.planGuardianApproval({
  packageId,
  capsuleId,
});`}</code></pre>
        <p>
          GuardianPanel only prepares the action. The guardian still reviews and signs the Sui
          transaction in their wallet.
        </p>
      </section>
    </DocsLayout>
  );
}
