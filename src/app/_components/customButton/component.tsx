import "./customButton.css";

type ButtonType = "primary" | "secondary" | "alert"

interface CustomButtonProps {
    label: string
    type: ButtonType
    onClickCallback: () => void
    disabled?: boolean
}

export default function CustomButton({
    label,
    type,
    onClickCallback,
    disabled
}: CustomButtonProps) {
    function getClassForType(type: ButtonType): string {
        const baseClass = "customButton"

        switch (type) {
            case "primary":
                return baseClass + " buttonPrimary";
            case "secondary":
                return baseClass + " buttonSecondary";
            case "alert":
                return baseClass + " buttonAlert";
        }
    }

    return <>
    <button className={getClassForType(type)} onClick={onClickCallback} disabled={disabled}>{label}</button>
    </>
}