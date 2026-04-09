"use client";
import { createClient } from "@/_lib/supabase/client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const supabase = useMemo(() => createClient(), []); // cria só uma vez
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const get_user = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (ignore) return;

      if (!user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("nickname, avatar_url, is_admin")
        .eq("auth_user_id", user.id)
        .single();

      if (!ignore) {
        setProfile(data);
        setLoading(false);
      }
    };

    get_user();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (["SIGNED_IN", "SIGNED_OUT", "TOKEN_REFRESHED"].includes(event)) {
        get_user();
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
