#include "FastLED.h"

#define NUM_LEDS 300

#define DATA_PIN 13

CRGB leds[NUM_LEDS];

void setup() {
    FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);_LEDS);
    FastLED.setBrightness(CRGB(255,255,255));
}

uint32_t index = 0;

void loop() {
   for (short i = 0; i < 300; i++) {
    leds[i] = CRGB(255, 255, 255);
   }
   FastLED.show();
   delay(5);
}
