package com.hn84.mobile;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.view.View;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {
    private int id = -1;

   private Handler handler = new Handler(new Handler.Callback() {
       @Override
       public boolean handleMessage(@NonNull Message message) {
            if(message.what == 1) {
                id = (int) message.obj;
            }

            return true;
       }
   });

    Thread reqThread;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        reqThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL getURL = new URL("http://10.0.2.2:8080/api/v1/controller");
                    HttpURLConnection con = (HttpURLConnection) getURL.openConnection();
                    con.setRequestMethod("GET");
                    int respCode = con.getResponseCode();
                    if (respCode == HttpURLConnection.HTTP_OK) {
                        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                        String inputLine;
                        StringBuffer response = new StringBuffer();

                        while((inputLine = in.readLine()) != null) {
                            response.append(inputLine);
                        }
                        in.close();

                        String data = response.toString();
                        JSONObject json = new JSONObject(data);
                        Message message = handler.obtainMessage(1, json.getInt("id"));
                        Log.d("HN84", Integer.toString(json.getInt("id")));
                        handler.sendMessage(message);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        reqThread.start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        URL postURL = new URL("http://10.0.2.2:8080/api/v1/controller/" + Integer.toString(id) + "/heartbeat");
                        HttpURLConnection con = (HttpURLConnection) postURL.openConnection();
                        con.setRequestMethod("POST");
                        con.setRequestProperty("Content-Type", "application/json");
                        con.setDoOutput(true);
                        String json = "{}";

                        try (OutputStream os = con.getOutputStream()) {
                            byte[] input = json.getBytes(StandardCharsets.UTF_8);
                            os.write(input, 0, input.length);
                        }

                        Log.d("HN84", json);
                        con.getResponseCode();
                        Thread.sleep(5000);

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public void onButtonClick(View v) {
        String button = "";
        if(v.getId() == R.id.upButton) {
            button = "up";
        }
        else if(v.getId() == R.id.downButton) {
            button = "down";
        }
        else if(v.getId() == R.id.leftButton) {
            button = "left";
        }
        else if(v.getId() == R.id.rightButton) {
            button = "right";
        }

        Log.d("HN84", Integer.toString(id) + " " + button);
        postDirection(button);
    }

    public void postDirection(String direction) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL postURL = new URL("http://10.0.2.2:8080/api/v1/controller/" + Integer.toString(id) + "/direction");
                    HttpURLConnection con = (HttpURLConnection) postURL.openConnection();
                    con.setRequestMethod("POST");
                    con.setRequestProperty("Content-Type", "application/json");
                    con.setDoOutput(true);
                    String json = "{\"direction\": \"" + direction + "\"}";

                    try (OutputStream os = con.getOutputStream()) {
                        byte[] input = json.getBytes(StandardCharsets.UTF_8);
                        os.write(input, 0, input.length);
                    }

                    Log.d("HN84", json);
                    con.getResponseCode();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}