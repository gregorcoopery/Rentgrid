import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - RentGrid</title>
        <meta name="description" content="Read RentGrid's privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen flex flex-col gradient-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 8, 2026</p>

            <div className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>1. Introduction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to RentGrid ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>
                  <p>
                    By using RentGrid, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>2. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">Personal Information</p>
                  <p>We collect personal information that you voluntarily provide to us when you:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Register for an account (name, email address, phone number)</li>
                    <li>Request hostel inspections (university affiliation, preferred dates)</li>
                    <li>Make reservations (payment information, identification documents)</li>
                    <li>Contact our support team (communication history)</li>
                    <li>List a hostel as a landlord (property details, ownership documents)</li>
                  </ul>

                  <p className="font-semibold text-foreground mt-6">Automatically Collected Information</p>
                  <p>When you use our platform, we automatically collect certain information, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, search queries)</li>
                    <li>Location data (with your permission)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>3. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, operate, and maintain our platform</li>
                    <li>Process your hostel searches, inspections, and reservations</li>
                    <li>Verify your identity and prevent fraud</li>
                    <li>Communicate with you about your account and transactions</li>
                    <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                    <li>Improve our platform and develop new features</li>
                    <li>Analyze usage patterns and trends</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce our agreements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>4. Information Sharing and Disclosure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>We may share your information in the following situations:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><span className="font-semibold text-foreground">With Landlords:</span> When you request an inspection or make a reservation, we share necessary information with the hostel landlord.</li>
                    <li><span className="font-semibold text-foreground">With Service Providers:</span> We work with third-party companies that help us operate our platform (payment processors, hosting providers, analytics services).</li>
                    <li><span className="font-semibold text-foreground">For Legal Reasons:</span> We may disclose your information if required by law or to protect our rights and safety.</li>
                    <li><span className="font-semibold text-foreground">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                  </ul>
                  <p className="mt-4">
                    We do not sell your personal information to third parties for marketing purposes.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>5. Data Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Secure payment processing through certified providers</li>
                  </ul>
                  <p className="mt-4">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>6. Your Privacy Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>Depending on your location, you may have the following rights:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><span className="font-semibold text-foreground">Access:</span> Request a copy of the personal information we hold about you</li>
                    <li><span className="font-semibold text-foreground">Correction:</span> Request correction of inaccurate or incomplete information</li>
                    <li><span className="font-semibold text-foreground">Deletion:</span> Request deletion of your personal information</li>
                    <li><span className="font-semibold text-foreground">Objection:</span> Object to our processing of your information</li>
                    <li><span className="font-semibold text-foreground">Portability:</span> Request transfer of your information to another service</li>
                    <li><span className="font-semibold text-foreground">Withdraw Consent:</span> Withdraw consent for processing where we rely on consent</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us at privacy@hostelsai.ng.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>8. Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Our platform is intended for users who are at least 18 years old or the age of majority in their jurisdiction. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>9. Changes to This Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>10. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about this Privacy Policy, please contact us:</p>
                  <ul className="list-none space-y-2 ml-4">
                    <li>Email: privacy@hostelsai.ng</li>
                    <li>Phone: +234 800 123 4567</li>
                    <li>Address: Lagos, Nigeria</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;