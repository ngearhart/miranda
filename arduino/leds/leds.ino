#include "FastLED.h"

#define NUM_LEDS 300

#define DATA_PIN 13

CRGB leds[NUM_LEDS];

void setup() {
    FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);
}

byte index = 0;

void loop() {
   for (short i = 0; i < 300; i++) {
    leds[i] = CHSV((index + i) * 2, 255, 255);
   }
   index++;
   FastLED.show();
   delay(10);
}
