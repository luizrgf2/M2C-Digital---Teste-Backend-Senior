import mongoose from "mongoose";
import {createId}  from "@paralleldrive/cuid2"

const messageSchema = new mongoose.Schema(
  {
    identifier: {type: String, required: true, unique: true},
    phone_number: { type: String, required: true },
    message: { type: String, required: true },
    campaign_id: { type: String, required: true },
    deleted: {type: Boolean, required: true}

  },
  { timestamps: true }
);

messageSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at"
})

export const MessageModel = mongoose.model('Message', messageSchema);

messageSchema.pre("save", (next,opts)=>{
    const message = this as any
    try{
        message.identifier = createId()
        next()
    }catch(e){
        console.error("ERR_TO_SAVE_MESSAGE",e)
        throw new Error(e)
    }
})