// components/CustomCheckbox.js

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-baseline cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden peer"
      />
      <div className="w-5 h-5 rounded border-2 border-purple-600 flex items-center justify-center bg-white peer-checked:bg-purple-600">
        <svg
          className={`w-4 h-4 text-white ${checked ? 'block' : 'hidden'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <span className="ml-2 text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
