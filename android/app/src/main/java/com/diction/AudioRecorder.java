package com.diction;

import android.media.AudioRecord;
import android.media.MediaRecorder;

import java.util.ArrayList;
import java.util.List;

public class AudioRecorder {

    // private static final int SAMPLE_RATE = 44100; // You can choose a different sample rate if needed
    // private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    // private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;

    private AudioRecord audioRecord;
    private int bufferSize;
    private boolean isRecording = false;

    // ArrayList to store audio data
    private List<Short> audioData = new ArrayList<>();

    public AudioRecorder(int SAMPLE_RATE, int CHANNEL_CONFIG, int AUDIO_FORMAT) {
        bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT);
        audioRecord = new AudioRecord(
                MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                CHANNEL_CONFIG,
                AUDIO_FORMAT,
                bufferSize);
    }

    public void startRecording() {
        if (!isRecording) {
            isRecording = true;
            audioRecord.startRecording();

            // Start a new thread for recording
            new Thread(new Runnable() {
                @Override
                public void run() {
                    recordData();
                }
            }).start();
        }
    }

    public void stopRecording() {
        if (isRecording) {
            isRecording = false;
            audioRecord.stop();
            audioRecord.release();
        }
    }

    public List<Short> getAudioData() {
        return audioData;
    }

    private void recordData() {
        short[] buffer = new short[bufferSize];
        while (isRecording) {
            int bytesRead = audioRecord.read(buffer, 0, bufferSize);
            // Process the audio data or save it as needed
            if (bytesRead > 0) {
                // Add the audio data to the ArrayList
                for (int i = 0; i < bytesRead; i++) {
                    audioData.add(buffer[i]);
                }
            }
        }
    }
}
