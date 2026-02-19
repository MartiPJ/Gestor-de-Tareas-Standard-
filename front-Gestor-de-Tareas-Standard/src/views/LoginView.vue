<template>
  <div class="login-page">
    <div class="login-deco">
      <div class="deco-grid"></div>
      <div class="deco-orb"></div>
    </div>

    <div class="login-card">
      <div class="login-brand">
        <span class="brand-icon">◈</span>
        <span class="brand-name">FlowTask</span>
      </div>
      <p class="login-subtitle">Gestor de tareas para equipos creativos</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
            autocomplete="email"
          />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Ingresar →</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(form.value)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e.message || 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-page {
  min-height: 100vh;
  background: #0d0d0f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.login-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(245, 166, 35, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 166, 35, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

.deco-orb {
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.login-card {
  background: #111114;
  border: 1px solid #2a2a34;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  animation: cardIn 0.4s ease;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.brand-icon {
  font-size: 28px;
  color: #f5a623;
}

.brand-name {
  font-family: 'Space Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: #f0ede8;
}

.login-subtitle {
  font-size: 13px;
  color: #555;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input {
  background: #0d0d0f;
  border: 1px solid #2a2a34;
  border-radius: 10px;
  padding: 12px 14px;
  color: #e8e8e0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: #f5a623;
}
.field input::placeholder {
  color: #3a3a44;
}

.error-msg {
  font-size: 13px;
  color: #e05252;
  background: rgba(224, 82, 82, 0.08);
  border: 1px solid rgba(224, 82, 82, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
}

.login-btn {
  background: #f5a623;
  color: #0d0d0f;
  border: none;
  border-radius: 10px;
  padding: 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
}

.login-btn:hover:not(:disabled) {
  background: #e89910;
  transform: translateY(-1px);
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #0d0d0f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
