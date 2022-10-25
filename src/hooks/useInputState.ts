import { useState } from "react";
export function useInputState(initiaVal?: number ): any {
	const [input, setInput] = useState(initiaVal);

	const handleChange = (e: { target: { value: any } }) => {
		setInput(Number(e.target.value));
	};
	const reset = () => {
		setInput(undefined);
	};
	return [input, handleChange, reset] as const;
}
