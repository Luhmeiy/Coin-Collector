// Interfaces
import { PresetListingProps } from "../../interfaces/PresetListingProps";

// Libraries
import { PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context";

const PresetList = ({
	filteredPresets,
	handleDeletePreset,
}: PresetListingProps) => {
	const { state } = useContext(ThemeContext);

	const navigate = useNavigate();

	return (
		<div
			className={`[&>*:nth-child(even)]:bg-${state.mode} overflow-y-auto scrollbar scrollbar-thumb-zinc-400 max-tablet:hidden [&>*:nth-child(even)]:backdrop-brightness-75`}
		>
			{filteredPresets &&
				filteredPresets.map((preset) => (
					<div
						key={preset.id}
						className="grid grid-cols-7 items-center gap-3 border-b-2 border-r-2 border-black p-5"
					>
						<p>{preset.name}</p>
						<p>{preset.symbol}</p>
						<p>{preset.initial_emission_date}</p>
						<p>{preset.final_emission_date}</p>

						<p>
							{preset.value_range.map((value, i) => {
								return (
									<span key={value + i}>
										{value}
										{preset.value_range.length === i + 1
											? ""
											: ", "}
									</span>
								);
							})}
						</p>

						<div className="col-span-2 flex flex-wrap gap-2">
							<button
								className="input flex w-auto items-center gap-2 bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400 active:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-400"
								onClick={() =>
									navigate(`/edit/preset/${preset.id}`)
								}
							>
								<PencilSimple size={20} weight="bold" /> Edit
							</button>

							<button
								className="input flex w-auto items-center gap-2 bg-red-400 px-6 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
								onClick={() => handleDeletePreset(preset.id)}
							>
								<Trash size={20} weight="bold" /> Delete
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default PresetList;
