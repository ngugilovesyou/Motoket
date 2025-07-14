import React from 'react'

function FAQ() {
  return (
    <section className="page-section hidden" id="faq">
      <div className="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Common questions about buying and selling luxury vehicles</p>
      </div>
      <div className="about-content">
        <div className="about-card">
          <h3>How do you verify vehicle authenticity?</h3>
          <p>
            We conduct comprehensive inspections including VIN verification,
            service history checks, and third-party authentication for all
            luxury vehicles.
          </p>
        </div>
        <div className="about-card">
          <h3>What financing options are available?</h3>
          <p>
            We offer competitive financing through premium lenders, leasing
            options, and can work with your preferred financial institution.
          </p>
        </div>
        <div className="about-card">
          <h3>Do you offer warranties?</h3>
          <p>
            Yes, we provide comprehensive warranty options and extended coverage
            plans for added peace of mind with your luxury vehicle purchase.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ