<template>
  <div class="flex min-h-screen items-center justify-center bg-[#202123] px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="flex flex-col items-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#10a37f] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-[#c5c5d2]">
          Welcome! Please enter your details.
        </p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-3 rounded-md shadow-sm">
          <div>
            <label for="name" class="block text-sm font-medium text-[#c5c5d2] mb-1">Name</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="relative block w-full rounded-md border-0 bg-[#343541] py-3 px-4 text-white placeholder-gray-500 focus:z-10 focus:ring-2 focus:ring-[#10a37f] focus:outline-none sm:text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email-address" class="block text-sm font-medium text-[#c5c5d2] mb-1">Email address</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full rounded-md border-0 bg-[#343541] py-3 px-4 text-white placeholder-gray-500 focus:z-10 focus:ring-2 focus:ring-[#10a37f] focus:outline-none sm:text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[#c5c5d2] mb-1">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full rounded-md border-0 bg-[#343541] py-3 px-4 text-white placeholder-gray-500 focus:z-10 focus:ring-2 focus:ring-[#10a37f] focus:outline-none sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-md bg-[#10a37f] py-3 px-4 text-sm font-semibold text-white hover:bg-[#1a7f64] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10a37f] transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </form>

      <div class="text-center text-sm text-[#c5c5d2]">
        Already have an account? 
        <a href="#" class="font-medium text-[#10a37f] hover:underline">Log in</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="typescript">
import { ref } from 'vue'

// Define the shape of our form data using TypeScript
type LoginForm = {
  name: string;
  email: string;
  password: string;
}

// Reactive form state
const formData = ref<LoginForm>({
  name: '',
  email: '',
  password: ''
})

// Handle form submission
const handleSubmit = () => {
  console.log('Form Submitted successfully:', {
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password
  })
  
  // You can plug in your Firebase, Supabase, or custom API authentication logic here.
}
</script>