package com.example.inscriptie

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class HistoryActivity : AppCompatActivity() {

    private var token: String? = null
    private lateinit var historyRecyclerView: RecyclerView
    private lateinit var historyAdapter: HistoryAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_history)

        token = intent.getStringExtra("TOKEN")
        Log.d("HistoryActivity", "Received token: $token")

        // Inisialisasi RecyclerView dan Adapter
        historyRecyclerView = findViewById(R.id.historyRecyclerView)
        historyAdapter = HistoryAdapter()
        historyRecyclerView.adapter = historyAdapter
        historyRecyclerView.layoutManager = LinearLayoutManager(this)

        if (token != null) {
            fetchHistory()
        } else {
            Toast.makeText(this, "Token is null", Toast.LENGTH_SHORT).show()
        }
    }

    private fun fetchHistory() {
        val client = OkHttpClient()
        val url = "https://inscriptie-dot-capstone-project-c241-pr566.et.r.appspot.com"

        Log.d("HistoryActivity", "Fetching history with token: $token")

        val request = Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer $token")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@HistoryActivity, "Network Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
                Log.e("HistoryActivity", "onFailure: ${e.message}", e)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    if (responseBody != null) {
                        try {
                            val jsonResponse = JSONObject(responseBody)
                            val status = jsonResponse.getString("status")
                            if (status == "success") {
                                val data = jsonResponse.getJSONArray("data")
                                // Update data di Adapter
                                runOnUiThread {
                                    historyAdapter.updateData(data)
                                    Toast.makeText(this@HistoryActivity, "History fetched successfully", Toast.LENGTH_SHORT).show()
                                }
                            } else {
                                runOnUiThread {
                                    Toast.makeText(this@HistoryActivity, "Failed to fetch history", Toast.LENGTH_SHORT).show()
                                }
                            }
                        } catch (e: Exception) {
                            runOnUiThread {
                                Toast.makeText(this@HistoryActivity, "Failed to parse response", Toast.LENGTH_SHORT).show()
                            }
                            Log.e("HistoryActivity", "Failed to parse response: ${e.message}", e)
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(this@HistoryActivity, "Response body is null", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(this@HistoryActivity, "Failed to fetch history: ${response.code}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }
}
