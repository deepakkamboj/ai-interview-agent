// Sample interview questions organized by category and difficulty

export const sampleQuestions = {
  behavioral: {
    easy: [
      "Tell me about a project you're proud of. What was your role?",
      "Describe a time you had to learn something new quickly.",
      "Tell me about a time you received critical feedback. How did you handle it?",
      "Describe your ideal work environment.",
      "What motivates you in your work?",
    ],
    medium: [
      "Tell me about a time you had a conflict with a team member. How did you resolve it?",
      "Describe a situation where you had to adapt to significant changes.",
      "Tell me about a time you failed. What did you learn?",
      "Describe your leadership style with an example.",
      "Tell me about a time you had to meet a tight deadline.",
    ],
    hard: [
      "Tell me about a time you had to make an ethical decision that was difficult.",
      "Describe a situation where you had to influence people without direct authority.",
      "Tell me about a time you managed a complex stakeholder situation.",
      "Describe a failure that significantly impacted your career.",
      "Tell me about a time you advocated for an unpopular idea successfully.",
    ],
  },
  technical: {
    easy: [
      "Explain the difference between SQL and NoSQL databases.",
      "What is REST API and why is it useful?",
      "Explain the concept of version control and why it's important.",
      "What is the difference between frontend and backend development?",
      "Explain what cloud computing is.",
    ],
    medium: [
      "Explain the concept of microservices architecture.",
      "What is the difference between synchronous and asynchronous programming?",
      "Explain what Docker and containerization do.",
      "What is CI/CD and why is it important?",
      "Explain the OSI model and its layers.",
    ],
    hard: [
      "Design a scalable system for a social media platform.",
      "Explain the CAP theorem and its implications.",
      "How would you optimize a slow database query?",
      "Describe different caching strategies and their trade-offs.",
      "Explain how you would design a distributed payment system.",
    ],
  },
  hr: {
    easy: [
      "Why are you interested in this position?",
      "What are your greatest strengths?",
      "What is your biggest weakness and how are you working on it?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
    ],
    medium: [
      "Describe your career goals and how this role aligns with them.",
      "What do you know about our company?",
      "How do you handle stress and pressure?",
      "What's your experience with remote work?",
      "Describe your experience working with diverse teams.",
    ],
    hard: [
      "Tell me about your career transition and why you made it.",
      "How would you contribute to company culture?",
      "What's your salary expectation and why?",
      "How do you stay updated with industry trends?",
      "Describe your entrepreneurial mindset.",
    ],
  },
}

export const codingProblems = [
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "easy",
    description:
      "Write a function that takes a string as input and returns the string reversed. For example: reverse('hello') should return 'olleh'.",
    starterCode: `function reverseString(str) {
  // Write your code here
}

// Test cases
console.log(reverseString('hello')); // Expected: 'olleh'
console.log(reverseString('world')); // Expected: 'dlrow'`,
    language: "javascript",
  },
  {
    id: "palindrome",
    title: "Check if Palindrome",
    difficulty: "easy",
    description:
      "Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore spaces and case sensitivity.",
    starterCode: `function isPalindrome(str) {
  // Write your code here
}

// Test cases
console.log(isPalindrome('A man a plan a canal Panama')); // Expected: true
console.log(isPalindrome('hello')); // Expected: false`,
    language: "javascript",
  },
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    difficulty: "medium",
    description:
      "Write a function that returns the nth number in the Fibonacci sequence. The sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.",
    starterCode: `function fibonacci(n) {
  // Write your code here
  // Return the nth Fibonacci number
}

// Test cases
console.log(fibonacci(0));  // Expected: 0
console.log(fibonacci(1));  // Expected: 1
console.log(fibonacci(6));  // Expected: 8`,
    language: "javascript",
  },
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "medium",
    description:
      "Given an array of numbers and a target number, find two numbers in the array that add up to the target. Return the indices of the two numbers.",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
  // Return array of two indices
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9));    // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));         // Expected: [1, 2]`,
    language: "javascript",
  },
]
