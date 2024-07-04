import "./checkboxWithLabel.css"

interface CheckboxWithLabelProps {
    label: string
    value: boolean
    onValueChange: (newValue: boolean) => void
}

export default function CheckboxWithLabel(props: CheckboxWithLabelProps) {
    return (
        <div className="checkboxInputGroup">
            <div>{props.label}</div>
            <input
                type="checkbox"
                checked={props.value}
                onChange={() => props.onValueChange(!props.value)}
            />
        </div>
    )
}