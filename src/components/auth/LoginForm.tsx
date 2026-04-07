"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const styles: Record<string, CSSProperties> = {
  form: {
    marginTop: 20,
    display: "grid",
    gap: 12,
  },
  label: {
    display: "grid",
    gap: 6,
    color: "rgba(255,255,255,0.60)",
    fontSize: 13,
  },
  input: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0F1B35",
    color: "#FFFFFF",
    padding: "10px 12px",
    outline: "none",
  },
  button: {
    marginTop: 4,
    borderRadius: 10,
    border: "1px solid rgba(0,212,170,0.45)",
    background: "#00D4AA",
    color: "#060B18",
    fontWeight: 700,
    padding: "10px 14px",
    cursor: "pointer",
  },
  error: {
    marginTop: 4,
    color: "#FF6B6B",
    fontSize: 13,
  },
  helper: {
    margin: 0,
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
  },
};

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    return submitting || !email.trim() || !password.trim();
  }, [email, password, submitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.error) {
        setError("No fue posible iniciar sesión. Verifica tus credenciales.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (submissionError) {
      console.error("[Internal]", submissionError);
      setError("Error interno");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form style={styles.form} onSubmit={onSubmit}>
      <label style={styles.label}>
        Correo
        <input
          style={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@gotom.com"
          required
        />
      </label>
      <label style={styles.label}>
        Contraseña
        <input
          style={styles.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
        />
      </label>
      <button style={styles.button} type="submit" disabled={isDisabled}>
        {submitting ? "Ingresando..." : "Iniciar sesión"}
      </button>
      {error ? <p style={styles.error}>{error}</p> : null}
      <p style={styles.helper}>Acceso restringido a usuarios autorizados de la agencia.</p>
    </form>
  );
}
