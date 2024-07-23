import "./checkboxWithLabel.css"

interface CheckboxWithLabelProps {
    label: string
    value: boolean
    onValueChange: (newValue: boolean) => void
}

export default function CheckboxWithLabel(props: CheckboxWithLabelProps) {
    return (
        <label className="checkboxInputGroup">
            {props.label}
            <input
                name={props.label}
                type="checkbox"
                checked={props.value}
                onChange={() => props.onValueChange(!props.value)}
            />
        </label>
    )
}
