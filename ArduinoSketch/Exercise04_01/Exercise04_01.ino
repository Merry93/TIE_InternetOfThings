#include <TH02_dev.h>
#include <ArduinoJson.h>
#include "Arduino.h"
#include "Wire.h" 

StaticJsonDocument<200> measAdd;

void setup()
{  
  Serial.begin(9600);        // start serial for output
  
  Serial.println("****TH02_dev demo by seeed studio****\n");
  /* Power up,delay 150ms,until voltage is stable */
  delay(150);
  /* Reset HP20x_dev */
  TH02.begin();
  delay(100);
  
  /* Determine TH02_dev is available or not */
  Serial.println("TH02_dev is available.\n"); 


  StaticJsonDocument<100> nodeAdd;
  StaticJsonDocument<100> sensorAdd;
  

  // Add a Node 
  nodeAdd["device"] = "ArduinoUno";
  nodeAdd["description"] = "Uno board in TC219";
  serializeJson(nodeAdd, Serial);
  Serial.println();

  // Add a Sensor 
  sensorAdd["nodeId"] = 1;
  sensorAdd["type"] = "Temperature";
  serializeJson(sensorAdd, Serial);
  // Start a new line
  Serial.println();

  
  // Generate the prettified JSON and send it to the Serial port.
  //
  // serializeJsonPretty(doc, Serial);
  // The above line prints:
  // {
  //   "sensor": "gps",
  //   "time": 1351824120,
  //   "data": [
  //     48.756080,
  //     2.302038
  //   ]
// }
}
 

void loop()
{
//   float temper = TH02.ReadTemperature(); 
//   Serial.println("Temperature: ");   
//   Serial.print(temper);
//   Serial.println("C\r\n");
   
//   float humidity = TH02.ReadHumidity();
//   Serial.println("Humidity: ");
//   Serial.print(humidity);
//   Serial.println("%\r\n");


  // Add a Measurement 
  measAdd["sensorId"] = 1;
  measAdd["timestamp"] = "JustNow";
  measAdd["value"] = TH02.ReadTemperature();
  serializeJson(measAdd, Serial);
  Serial.println();
   delay(1000);
}
