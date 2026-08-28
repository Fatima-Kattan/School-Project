// components/auth/login/LoginForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { LogIn, User, Lock, EyeOff, Eye } from "lucide-react";
import styles from "./LoginForm.module.css";
import { Input } from "@/components/shared/input/inpute";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Username:", username);
            console.log("Password:", password);

            await new Promise((resolve) => setTimeout(resolve, 1500));

        } catch (err) {
            setError("حدث خطأ في تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.container}>
            {/* ========== القسم الأيمن = أبيض ========== */}
            <div className={styles.rightSection}>
                <div className={styles.loginWrapper}>
                    <div className={styles.header}>
                        <div className={styles.loginIcon}>
                            <LogIn size={30} strokeWidth={1.5} />
                        </div>
                        <h1 className={styles.title}>تسجيل الدخول</h1>
                        <p className={styles.subtitle}>
                            سجل دخولك الان وابدا العمل بسلاسة مطلقة
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.errorMessage}>
                                ⚠️ {error}
                            </div>
                        )}
                        
                        <div className={styles.inputGroup}>
                            <Input
                                id="username"
                                type="text"
                                label="اسم المستخدم"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="أدخل اسم المستخدم"
                                required
                                containerClassName={styles.inputGroup}
                                inputClassName={styles.input}
                                labelClassName={styles.label}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                label="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور"
                                required
                                icon={
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="focus:outline-none inline-flex items-center justify-center"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                }
                                iconPosition="left"
                                containerClassName={styles.inputGroup}
                                inputClassName={styles.input}
                                labelClassName={styles.label}
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </button>

                    </form>
                </div>
            </div>

            {/* ========== القسم الأيسر = أخضر ========== */}
            <div className={styles.leftSection}>
                <div className={styles.logoWrapper}>
                    <div className={styles.schoolIcon}>
                        <Image
                            src="/images/Logo.svg"
                            alt="main icon"
                            width={280}
                            height={280}
                            priority
                            className={styles.schoolImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}