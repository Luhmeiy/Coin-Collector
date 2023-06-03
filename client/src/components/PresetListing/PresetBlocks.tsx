// Interfaces
import { PresetListingProps } from "../../interfaces/PresetListingProps";

// Libraries
import { PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context";

const PresetBlocks = ({
	filteredPresets,
	handleDeletePreset,
}: PresetListingProps) => {
	const { state } = useContext(ThemeContext);

	const navigate = useNavigate();

	return (
		<div
			className={`grid h-full auto-rows-max grid-cols-3 gap-3 overflow-y-auto bg-${state.theme} p-4 pt-10 max-form:grid-cols-2 tablet:hidden`}
		>
			{filteredPresets &&
				filteredPresets.map((preset) => (
					<div
						key={preset.id}
						className="input flex h-auto flex-col bg-light-mode px-3 py-2 dark:bg-dark-mode"
					>
						<p>
							<span className="font-semibold">{preset.name}</span>{" "}
							({preset.symbol})
						</p>
						<p>
							({preset.initial_emission_date} -{" "}
							{preset.final_emission_date})
						</p>
						<p>
							<span className="font-semibold">Value range: </span>
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

						<div className="mt-3 flex flex-1 items-end justify-center gap-2">
							<button
								className="input flex max-w-[4.5rem] justify-center bg-gray-300 py-2 font-semibold text-gray-800 hover:bg-gray-400 active:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-400"
								onClick={() =>
									navigate(`/edit/preset/${preset.id}`)
								}
							>
								<PencilSimple size={20} weight="bold" />
							</button>

							<button
								className="input input flex max-w-[4.5rem] justify-center bg-red-400 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
								onClick={() => handleDeletePreset(preset.id)}
							>
								<Trash size={20} weight="bold" />
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default PresetBlocks;
