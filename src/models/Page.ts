import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  name: string;
  slug: string;
  content: {
    sections: any[];
  };
  publishedContent: {
    sections: any[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: {
      sections: { type: [Schema.Types.Mixed], default: [] },
    },
    publishedContent: {
      sections: { type: [Schema.Types.Mixed], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model query cache on hot reload
export default mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
