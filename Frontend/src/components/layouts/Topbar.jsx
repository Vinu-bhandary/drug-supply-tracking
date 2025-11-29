import AvatarButton from "../buttons/AvatarButton";
export default function Topbar({ title }) {
    return (
        <div className="flex flex-row w-full h-16 bg-blue-600  px-4">
            <h1 className="text-white text-xl font-semibold">{title}</h1>
            <AvatarButton />
        </div>
    );
}