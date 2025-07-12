export const useMock = false;

export const mockResponse = `<Form.Item label="姓名" name="name">
  <Input />
</Form.Item>
<Form.Item label="年龄" name="age">
  <InputNumber />
</Form.Item>`;

export const markdownContent2 = `
\`\`\`js
console.log("Hello");
\`\`\`
`;
export const markdownContent3 = `

这也是普通段落。

- 列表 1
- 列表 2

| 表头1 | 表头2 |
| ----- | ----- |
| 值1   | 值2   |
`;

export const markdownContent1 = `
\`\`\`jsx
import React, { useState } from 'react';

function MyForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(\`Name: \${name}, Age: \${age}\`);
    setName('');
    setAge('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} required />
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input type="number" id="age" value={age} onChange={handleAgeChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
\`\`\`

**说明：**
* 使用 \`useState\` 管理输入状态。
* 使用受控组件方式绑定表单。
* 提交时清空表单。
`;

export const markdownContent =
  '```jsx\n' +
  "import React, { useState } from 'react';\n" +
  '\n' +
  'function MyForm() {\n' +
  '  const [formData, setFormData] = useState({\n' +
  "    name: '',\n" +
  "    age: '',\n" +
  '  });\n' +
  '\n' +
  '  const handleChange = (event) => {\n' +
  '    const { name, value } = event.target;\n' +
  '    setFormData((prevFormData) => ({\n' +
  '      ...prevFormData,\n' +
  '      [name]: value,\n' +
  '    }));\n' +
  '  };\n' +
  '\n' +
  '  const handleSubmit = (event) => {\n' +
  '    event.preventDefault();\n' +
  "    console.log('Form submitted:', formData);\n" +
  '    // Here you would typically send the formData to an API or process it further\n' +
  '    // For example:\n' +
  "    // fetch('/api/submit-form', {\n" +
  "    //   method: 'POST',\n" +
  '    //   body: JSON.stringify(formData),\n' +
  '    //   headers: {\n' +
  "    //     'Content-Type': 'application/json'\n" +
  '    //   }\n' +
  '    // })\n' +
  '    // .then(response => response.json())\n' +
  "    // .then(data => console.log('Success:', data));\n" +
  '  };\n' +
  '\n' +
  '  return (\n' +
  '    <form onSubmit={handleSubmit}>\n' +
  '      <div>\n' +
  '        <label htmlFor="name">Name:</label>\n' +
  '        <input\n' +
  '          type="text"\n' +
  '          id="name"\n' +
  '          name="name"\n' +
  '          value={formData.name}\n' +
  '          onChange={handleChange}\n' +
  '          required // Add required attribute for validation\n' +
  '        />\n' +
  '      </div>\n' +
  '\n' +
  '      <div>\n' +
  '        <label htmlFor="age">Age:</label>\n' +
  '        <input\n' +
  '          type="number"\n' +
  '          id="age"\n' +
  '          name="age"\n' +
  '          value={formData.age}\n' +
  '          onChange={handleChange}\n' +
  '          min="0" // Add min attribute for validation\n' +
  '          required // Add required attribute for validation\n' +
  '        />\n' +
  '      </div>\n' +
  '\n' +
  '      <button type="submit">Submit</button>\n' +
  '\n' +
  '      <p>\n' +
  '          Form Data: \n' +
  '          Name: {formData.name}, Age: {formData.age}\n' +
  '      </p>\n' +
  '    </form>\n' +
  '  );\n' +
  '}\n' +
  '\n' +
  'export default MyForm;\n' +
  '```\n' +
  '\n' +
  'Key improvements and explanations:\n' +
  '\n' +
  '* **State Management:**  Uses `useState` to manage the form data in a React-friendly way. This is crucial for React to re-render the form as the user types.  The `formData` state variable holds an object containing `name` and `age`.\n' +
  '* **Controlled Components:**  The input fields (`<input>`) are *controlled components*.  This means their values are directly tied to the React state (`formData`).  The `onChange` handler updates the state whenever the user types in the input. This makes the form interactive and predictable.  Crucially, the `value` prop of each input is set to the corresponding value from the `formData` state.\n' +
  '* **`handleChange` Function:** This function is responsible for updating the form data whenever the user types in either the name or age input. It uses `event.target.name` to dynamically determine which field is being updated and `event.target.value` to get the new value. The spread operator (`...prevFormData`) ensures that the existing form data is preserved when updating only a single field.\n' +
  '* **`handleSubmit` Function:** This function is called when the form is submitted. It prevents the default form submission behavior (which would reload the page) and then logs the form data to the console.  This is where you would typically make an API call to send the data to your backend. The code includes commented-out example fetch API call.\n' +
  "* **`name` Attribute:**  The `name` attribute on the input elements is *essential*.  It's used by the `handleChange` function to correctly identify which field is being updated.\n" +
  '* **`id` and `htmlFor` Attributes:**  The `id` attribute on the input elements and the `htmlFor` attribute on the labels are used to associate the labels with the input fields. This is important for accessibility.\n' +
  '* **Form Submission Handling (`onSubmit`):**  The `onSubmit` event handler on the `<form>` element calls the `handleSubmit` function.\n' +
  '* **Validation Attributes:**  Uses `required` attributes on both input fields to enforce that the user must enter values for both name and age before submitting. Also, `min="0"` on the age field ensures a minimum value.  Browser-based validation is a good first step.\n' +
  '* **Number Input for Age:** The `type="number"` for the age field provides a numeric input field, often with up/down arrows for easy adjustment.  This improves the user experience.\n' +
  '* **Display form data:** Displays the current state of the form data, making it easier to see the impact of changes.\n' +
  '* **Clear Comments and Structure:**  Improved comments explain what each part of the code does.\n' +
  '\n' +
  'How to use this code snippet:\n' +
  '\n' +
  '1. **Create a new React component (e.g., `MyForm.js`).**\n' +
  '2. **Copy and paste the code into the file.**\n' +
  '3. **Import the component into your main App component or any other component where you want to use the form.**\n' +
  '4. **Render the component:**  `<MyForm />`\n' +
  '\n' +
  'Example `App.js`:\n' +
  '\n' +
  '```jsx\n' +
  "import React from 'react';\n" +
  "import MyForm from './MyForm'; // Adjust path if needed\n" +
  '\n' +
  'function App() {\n' +
  '  return (\n' +
  '    <div className="App">\n' +
  '      <h1>My Form Example</h1>\n' +
  '      <MyForm />\n' +
  '    </div>\n' +
  '  );\n' +
  '}\n' +
  '\n' +
  'export default App;\n' +
  '```\n' +
  '\n' +
  'To run this:\n' +
  '\n' +
  '1.  Make sure you have Node.js and npm (or yarn) installed.\n' +
  '2.  Create a new React project: `npx create-react-app my-app`\n' +
  '3.  Navigate to the project directory: `cd my-app`\n' +
  '4.  Replace the contents of `src/App.js` with the example above (importing your `MyForm` component).\n' +
  '5.  Create a `src/MyForm.js` file and paste the form component code into it.\n' +
  '6.  Run the development server: `npm start`\n' +
  '\n' +
  "This will open the app in your browser.  You should see the form rendered and be able to interact with it.  When you submit the form, the data will be logged to your browser's console.  Remember to replace the `console.log` in `handleSubmit` with your actual API call or data processing logic.\n";
