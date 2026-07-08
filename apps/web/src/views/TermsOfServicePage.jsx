import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - RentGrid</title>
        <meta name="description" content="Read RentGrid's terms of service to understand the rules and regulations for using our platform." />
      </Helmet>

      <div className="min-h-screen flex flex-col gradient-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 8, 2026</p>

            <div className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>1. Agreement to Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    By accessing or using RentGrid ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Platform.
                  </p>
                  <p>
                    These Terms apply to all visitors, users, students, landlords, and others who access or use the Platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>2. Description of Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    RentGrid is a platform that connects students seeking off-campus accommodation with verified landlords offering student hostels near Nigerian universities. We provide:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>A searchable database of verified student hostels</li>
                    <li>Inspection scheduling and coordination services</li>
                    <li>A platform for communication between students and landlords</li>
                    <li>Optional payment processing services</li>
                    <li>Verification and quality assurance of listed properties</li>
                  </ul>
                  <p className="mt-4">
                    RentGrid acts as an intermediary platform and is not a party to any rental agreements between students and landlords.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>3. User Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">Account Creation</p>
                  <p>To use certain features of the Platform, you must create an account. You agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>

                  <p className="font-semibold text-foreground mt-6">Account Eligibility</p>
                  <p>
                    You must be at least 18 years old or the age of majority in your jurisdiction to create an account. By creating an account, you represent that you meet this requirement.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>4. User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">For Students</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate information about your university affiliation</li>
                    <li>Attend scheduled inspections or notify us of cancellations</li>
                    <li>Communicate honestly with landlords</li>
                    <li>Honor reservation commitments</li>
                    <li>Leave honest reviews based on actual experiences</li>
                    <li>Comply with hostel rules and regulations</li>
                  </ul>

                  <p className="font-semibold text-foreground mt-6">For Landlords</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate information about your properties</li>
                    <li>Maintain properties in safe, habitable condition</li>
                    <li>Honor pricing and availability information</li>
                    <li>Cooperate with our verification process</li>
                    <li>Respond promptly to inspection requests</li>
                    <li>Treat all students fairly and without discrimination</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>5. Prohibited Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide false or misleading information</li>
                    <li>Impersonate another person or entity</li>
                    <li>Use the Platform for any illegal purpose</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Post fraudulent or deceptive listings</li>
                    <li>Attempt to circumvent our verification processes</li>
                    <li>Scrape or collect data from the Platform without permission</li>
                    <li>Interfere with the Platform's operation or security</li>
                    <li>Use the Platform to compete with us</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>6. Verification and Listings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We verify hostels and landlords to the best of our ability, but we cannot guarantee the accuracy of all information or the quality of all properties. Our verification badge indicates that we have conducted a physical inspection and document verification, but it does not constitute an endorsement or warranty.
                  </p>
                  <p className="mt-4">
                    We reserve the right to remove any listing that violates these Terms or our quality standards. We may also suspend or terminate accounts that repeatedly violate our policies.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>7. Payments and Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">For Students</p>
                  <p>
                    Using RentGrid to search and request inspections is free. When you make a reservation, you pay the hostel rent directly to the landlord or through our optional payment processing service. We do not charge service fees or commissions to students.
                  </p>

                  <p className="font-semibold text-foreground mt-6">For Landlords</p>
                  <p>
                    Landlords may be charged subscription fees for premium features. All fees are clearly disclosed before you subscribe. We may also charge transaction fees for payments processed through our platform.
                  </p>

                  <p className="font-semibold text-foreground mt-6">Refunds</p>
                  <p>
                    Refund policies for hostel reservations are set by individual landlords and are displayed on each listing. Subscription fees for landlords are generally non-refundable except as required by law.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>8. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    The Platform and its original content, features, and functionality are owned by RentGrid and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="mt-4">
                    You may not copy, modify, distribute, sell, or lease any part of our Platform without our express written permission.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>9. Disclaimers and Limitations of Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">Disclaimer</p>
                  <p>
                    THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                  </p>

                  <p className="font-semibold text-foreground mt-6">Limitation of Liability</p>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOSTELSAI.NG SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                  </p>
                  <p className="mt-4">
                    We are not responsible for disputes between students and landlords, property conditions, or the accuracy of user-generated content.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>10. Indemnification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    You agree to indemnify and hold harmless RentGrid, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use of the Platform</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Any content you post on the Platform</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>11. Dispute Resolution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with Nigerian law. You waive your right to participate in class action lawsuits.
                  </p>
                  <p className="mt-4">
                    Before initiating arbitration, you agree to first contact us to attempt to resolve the dispute informally.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>12. Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                  </p>
                  <p className="mt-4">
                    Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>13. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
                  </p>
                  <p className="mt-4">
                    Your continued use of the Platform after changes become effective constitutes your acceptance of the new Terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>14. Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>15. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>If you have any questions about these Terms, please contact us:</p>
                  <ul className="list-none space-y-2 ml-4">
                    <li>Email: legal@hostelsai.ng</li>
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

export default TermsOfServicePage;