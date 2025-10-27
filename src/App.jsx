import { motion } from "framer-motion"

export default function App() {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 className="text-5xl font-bold mb-4">
        Smooth entrance ✨
      </motion.h1>
    </motion.div>
  )
}
