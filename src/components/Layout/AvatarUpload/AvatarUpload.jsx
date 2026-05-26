"use client";
// Hooks
import { useState, useEffect } from "react";
import { createClient } from "@/_lib/supabase/client";

// Components
import Image from "next/image";
import { toast } from "sonner";

// Images
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";

// Utils
import styles from "./AvatarUpload.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AvatarUpload({ userId, currentAvatar }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar || null);
  const supabase = createClient();

  useEffect(() => {
    if (currentAvatar) setPreview(currentAvatar);
  }, [currentAvatar]);

  async function handle_upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // é um fluxo grandinho, vou dividir só pra n esquecer :D
    try {
      const form_data = new FormData();
      form_data.append("file", file);
      form_data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );
      form_data.append("public_id", `avatars/${userId}_${Date.now()}`);

      // manda a imagem pro cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form_data },
      );

      // pega a URL
      const result = await res.json();
      if (result.error) throw new Error(result.error.message);

      // envia pro supabase
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: result.secure_url })
        .eq("auth_user_id", userId);

      if (error) {
        toast.error(`Erro ao atualizar avatar: ${error.message}`);
        return;
      }

      setPreview(result.secure_url);
      toast.success("Avatar atualizado!");
    } catch (err) {
      toast.error(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar_ring}>
        <div className={styles.avatar_frame}>
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={96}
              height={96}
              className={styles.avatar_image}
            />
          ) : (
            <div className={styles.avatar_placeholder}>
              <FontAwesomeIcon
                icon={faUser}
                className={styles.placeholder_icon}
              />
            </div>
          )}

          {uploading && (
            <div className={styles.uploading_overlay}>
              <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            </div>
          )}
        </div>

        <label
          className={`${styles.camera_btn} ${uploading ? styles.disabled : ""}`}
        >
          <FontAwesomeIcon icon={faCamera} className={styles.camera_icon} />
          <input
            type="file"
            accept="image/*"
            onChange={handle_upload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <span className={styles.hint}>
        {uploading ? "Enviando..." : "Clique no ícone para trocar"}
      </span>
    </div>
  );
}

export default AvatarUpload;
