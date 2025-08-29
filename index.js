const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your personal information
const userInfo = {
  full_name: "anakha r varma", 
  dob: "12102004",
  email: "anakharvarma@gmail.com@example.com", 
  roll_number: "22BDS0416" 
};

// Helper function to check if a character is a letter
function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

// Helper function to check if a character is a number
function isNumber(char) {
  return /^\d+$/.test(char);
}

// Helper function to check if a character is a special character
function isSpecialChar(char) {
  return !isLetter(char) && !isNumber(char);
}

// Helper function to check if a number is even
function isEven(num) {
  return parseInt(num) % 2 === 0;
}

// Helper function to check if a number is odd
function isOdd(num) {
  return parseInt(num) % 2 !== 0;
}

// Helper function to create alternating caps string
function createAlternatingCaps(str) {
  return str.split('').map((char, index) => {
    return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
  }).join('');
}

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid input. 'data' must be an array."
      });
    }
    
    // Process the data
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialChars = [];
    let sum = 0;
    
    data.forEach(item => {
      const strItem = String(item);
      
      // Check if the entire item is a number
      if (isNumber(strItem)) {
        const num = parseInt(strItem);
        sum += num;
        
        if (isEven(num)) {
          evenNumbers.push(strItem);
        } else {
          oddNumbers.push(strItem);
        }
      } 
      // Check if the item contains only letters
      else if (strItem.split('').every(char => isLetter(char))) {
        alphabets.push(strItem.toUpperCase());
      } 
      // Process each character in the item
      else {
        for (const char of strItem) {
          if (isNumber(char)) {
            sum += parseInt(char);
            if (isEven(char)) {
              evenNumbers.push(char);
            } else {
              oddNumbers.push(char);
            }
          } else if (isLetter(char)) {
            alphabets.push(char.toUpperCase());
          } else if (isSpecialChar(char)) {
            specialChars.push(char);
          }
        }
      }
    });
    
    // Create the concatenated string in reverse order with alternating caps
    const allChars = alphabets.join('');
    const reversedChars = allChars.split('').reverse().join('');
    const concatString = createAlternatingCaps(reversedChars);
    
    // Prepare the response
    const response = {
      is_success: true,
      user_id: `${userInfo.full_name}_${userInfo.dob}`,
      email: userInfo.email,
      roll_number: userInfo.roll_number,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialChars,
      sum: sum.toString(),
      concat_string: concatString
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error"
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Bajaj Finserv Health API is running! Use POST /bfhl to interact with the API.');
});

// GET route for /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1,
    message: "This endpoint accepts POST requests only. Please send a POST request with a 'data' array in the request body."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
