import mongoose, { Schema } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    apiKey: { type: String, default: "" },
    primaryColor: { type: String, default: "#2563eb" },
    secondaryColor: { type: String, default: "#1e3a8a" },
    gradientStart: { type: String, default: "#3b82f6" },
    gradientEnd: { type: String, default: "#1e3a8a" },
    globalHeader: { type: Schema.Types.Mixed, default: null },
    globalFooter: { type: Schema.Types.Mixed, default: null },
    logoImg: { type: String, default: "" },
    logoText: { type: String, default: "" },
  },
  { timestamps: true, strict: false }
);

if (mongoose.models && mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
