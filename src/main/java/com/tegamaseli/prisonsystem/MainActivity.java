package com.tegamaseli.prisonsystem;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {
WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView=findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        // Set a WebViewClient to handle when links are clicked
        webView.setWebViewClient(new WebViewClient());

        // Load a URL into the WebView
        webView.loadUrl("192.168.22.128:8000/pages/map_page.html");
    }
    // Override onBackPressed to handle navigation within WebView
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}