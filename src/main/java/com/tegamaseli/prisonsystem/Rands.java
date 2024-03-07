package com.tegamaseli.prisonsystem;

import android.icu.text.DecimalFormat;

import java.util.Random;

public class Rands {
    static String getTemp(){
        Random rand = new Random();

        // Generate a random double between 15.0 and 25.0
        double randomNumber = 10.0 + rand.nextDouble() * 9.0;
        DecimalFormat df = new DecimalFormat("#.##");

        return df.format(randomNumber);
    }
    static String getNoise(){
        Random rand = new Random();
        int randomNumber = rand.nextInt(30) + 90;
        return String.valueOf(randomNumber);
    }
    static String getLight(){
        Random rand = new Random();
        double randomNumber = 15.0 + rand.nextDouble() * 10.0;
        DecimalFormat df = new DecimalFormat("#.##");

        return df.format(randomNumber);
    }
}
