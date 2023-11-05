const int upPin = 5;
const int downPin = 4;
const int leftPin = 3;
const int rightPin = 2;
const int ledPin = 13;

int upState = 0;
int downState = 0;
int leftState = 0;
int rightState = 0;

void setup() {
  Serial.begin(9600);
  pinMode(upPin, INPUT);
  pinMode(downPin, INPUT);
  pinMode(leftPin, INPUT);
  pinMode(rightPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (upState == HIGH && digitalRead(upPin) == LOW) {
    Serial.println("up");
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }
  if (downState == HIGH && digitalRead(downPin) == LOW) {
    Serial.println("down");
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }
  if (leftState == HIGH && digitalRead(leftPin) == LOW) {
    Serial.println("left");
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }
  if (rightState == HIGH && digitalRead(rightPin) == LOW) {
    Serial.println("right");
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }
  
  upState = digitalRead(upPin);
  downState = digitalRead(downPin);
  leftState = digitalRead(leftPin);
  rightState = digitalRead(rightPin);
}
