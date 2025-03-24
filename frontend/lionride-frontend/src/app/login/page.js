export default function Login() {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="bg-white p-8 rounded-md shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Login to LionRide</h2>
          <form>
            <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4" />
            <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4" />
            <button className="w-full bg-orange-500 text-white py-2 rounded">Login</button>
          </form>
          <p className="text-center mt-4 text-sm">
            Do not have an account? <a href="/signup" className="text-orange-500">Sign Up</a>
          </p>
        </div>
      </div>
    );
  }
  