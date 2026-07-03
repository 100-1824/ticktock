import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <LoginForm />
      </div>
      <div className="hidden items-center justify-center bg-blue-600 px-14 lg:flex lg:w-1/2">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-white">ticktock</h2>
          <p className="mt-6 text-sm leading-6 text-gray-200">
            Introducing ticktock, our cutting-edge timesheet web application designed to
            revolutionize how you manage employee work hours. With ticktock, you can effortlessly
            track and monitor employee attendance and productivity from anywhere, anytime, using
            any internet-connected device.
          </p>
        </div>
      </div>
    </main>
  )
}
