"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import testimonials from "@/data/testimonials";
import { Card, CardContent } from "./ui/card";

const TestimonialCarousel = () => {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center text-green-900 mb-12">What Our Writers Say</h2>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => {
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <blockquote className="space-y-4">
                      <p className="text-green-700 italic">
                        &quot; {testimonial.text}&quot;
                      </p>
                      <footer>
                        <div className="font-semibold text-green-900">{testimonial.author}</div>
                        <div className="text-sm text-green-600">{testimonial.role}</div>
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
