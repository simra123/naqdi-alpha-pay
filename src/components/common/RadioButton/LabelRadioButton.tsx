const LabelRadioButton = ({
  label,
  options,
  selectedOption,
  handleChange,
}) => {
  return (
    <div className="flex gap-x-14">
      <span className="text-black-100">{label}</span>
      <div className="flex gap-x-12">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-baseline cursor-pointer"
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={selectedOption === option.value}
              onChange={() => handleChange(option.value)}
              className="hidden peer"
            />
            <div className="w-5 h-5 rounded-full border border-purple-100 flex items-center justify-center peer-checked:border-purple-600">
              <div
                className={`w-3 h-3  rounded-full ${
                  selectedOption === option.value ? "bg-purple-100" : ""
                }`}
              ></div>
            </div>
            <span className="ml-4 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default LabelRadioButton;
