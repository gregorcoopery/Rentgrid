import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FAQPage = () => {
  const faqCategories = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What is RentGrid?',
          answer: 'RentGrid is Nigeria\'s leading platform for verified general and student rentals. We connect renters with safe, affordable properties without hidden agent fees.',
        },
        {
          question: 'Is RentGrid free to use?',
          answer: 'Yes! Renters can browse, search, and request inspections completely free. We don\'t charge any service fees or agent commissions. You only pay the rent directly to the landlord.',
        },
        {
          question: 'What types of properties do you list?',
          answer: 'We list a wide range of properties including general rentals (apartments, flats, homes for professionals and families) and student rentals (hostels and lodges near university campuses).',
        },
      ],
    },
    {
      category: 'Inspections',
      questions: [
        {
          question: 'How does the inspection process work?',
          answer: 'After finding a property you like, click "Request Inspection" and choose a convenient time. Our team will coordinate with the landlord to arrange a physical tour of the property.',
        },
        {
          question: 'Why is there a small inspection fee?',
          answer: 'A small non-refundable inspection fee encourages serious bookings and respects the inspector\'s time and transport costs. This ensures high-quality service for everyone.',
        },
      ],
    },
    {
      category: 'Payments & Pricing',
      questions: [
        {
          question: 'Are there any hidden fees or agent charges?',
          answer: 'No! We believe in complete transparency. The price you see on the listing is the price you pay. There are no agent fees, service charges, or hidden costs.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We support bank transfers, card payments, and mobile money. All payments are processed securely. For students, we also support rent financing and parent payment links.',
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - RentGrid</title>
        <meta name="description" content="Find answers to common questions about RentGrid, including inspections, payments, verification, safety, and support." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about RentGrid
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-border/50 shadow-sm rounded-2xl bg-background">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, questionIndex) => (
                        <AccordionItem
                          key={questionIndex}
                          value={`item-${categoryIndex}-${questionIndex}`}
                          className="border border-border/50 rounded-xl px-4 bg-secondary/20"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-semibold text-foreground">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pt-2 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <Card className="mt-12 bg-primary/5 border-primary/20 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Still Have Questions?</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Our support team is here to help you 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="outline" size="lg" className="w-full bg-background text-foreground hover:bg-secondary border-border/50 rounded-xl h-14">
                    <a href="mailto:support@rentgrid.ng">
                      <Mail className="mr-2 h-5 w-5" />
                      support@rentgrid.ng
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full bg-background text-foreground hover:bg-secondary border-border/50 rounded-xl h-14">
                    <a href="tel:+2348001234567">
                      <Phone className="mr-2 h-5 w-5" />
                      +234 800 123 4567
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
