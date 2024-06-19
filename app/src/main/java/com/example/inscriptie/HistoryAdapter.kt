package com.example.inscriptie

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Locale

class HistoryAdapter : RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder>() {

    private var historyItems = JSONArray()

    fun updateData(newItems: JSONArray) {
        historyItems = newItems
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.history_item, parent, false)
        return HistoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: HistoryViewHolder, position: Int) {
        val item = historyItems.getJSONObject(position)
        val imageUrl = item.getString("image_url")
        val translationResult = item.optString("translation_result", "Translation not available")
        val createdAt = item.getString("created_at")

        Glide.with(holder.itemView.context)
            .load(imageUrl)
            .into(holder.historyImageView)

        holder.historyTranslationResult.text = translationResult
        holder.historyTranslationDate.text = formatDateTime(createdAt)
    }

    override fun getItemCount(): Int {
        return historyItems.length()
    }

    class HistoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val historyImageView: ImageView = itemView.findViewById(R.id.historyImageView)
        val historyTranslationResult: TextView = itemView.findViewById(R.id.historyTranslationResult)
        val historyTranslationDate: TextView = itemView.findViewById(R.id.historyTranslationDate)
    }

    private fun formatDateTime(dateTime: String): String {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val outputFormat = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault())
        val date = inputFormat.parse(dateTime)
        return outputFormat.format(date)
    }
}
