import { useEffect, useRef } from "react";
import mqtt from "mqtt";

export function useMqtt(topics: string[], onMessage: (topic: string, message: string) => void) {
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // Conexión al broker (puede ser ws:// o wss://)
    const client = mqtt.connect("ws://100.99.171.16:8080", {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");

      // Suscribirse a todos los topics
      topics.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) console.error(`Error subscribing to ${topic}`, err);
        });
      });
    });

    client.on("message", (topic, payload) => {
      onMessage(topic, payload.toString());
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });

    return () => {
      client.end();
    };
  }, [topics, onMessage]);
}