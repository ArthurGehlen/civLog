// src/_lib/context/UserContext.jsx
"use client";
// Utils
import { createClient } from "@/_lib/supabase/client";

// Hooks
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get_user = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("nickname, avatar_url, is_admin")
        .eq("auth_user_id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    get_user();

    // listener para logout e login
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      get_user();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
