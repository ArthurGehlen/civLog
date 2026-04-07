"use client";
import styles from "../layout.module.css"

const page = () => {
  const handle_submit = (e) => {
    e.preventDefault();
    console.log('teste');
  }

  return (
    <>
      <h1 className={styles.auth_title}>Login</h1>

      <form onSubmit={handle_submit} className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="email">Email</label>
          <input className={styles.input_container} type="email" id="email" placeholder="Digite o seu email" />
        </div>

        <div className={styles.input_wrapper}>
          <label className={styles.input_label} htmlFor="password">Senha</label>
          <input className={styles.input_container} type="password" id="password" placeholder="Digite sua senha" />
        </div>

        <button type="submit" className={styles.submit_btn}>Entrar</button>
      </form>
    </>
  );
};

export default page;
