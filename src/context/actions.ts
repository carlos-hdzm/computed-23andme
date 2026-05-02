import type { ChromosomeHaplotype, ComputedData, ComputedDataV5Entry, ComputedDataV7Entry } from "../types";
import type {
    SetDataAction,
    SetVersionAction,
    SetConfidenceAction,
    SetHighlightAction,
    SetSampleDataAction,
    ClearDataAction
} from "./types";

const contextActions = {
    setData(data: ComputedData<ChromosomeHaplotype>): SetDataAction {
        return { type: 'SET_DATA', data };
    },
    setVersion(version: keyof ComputedData<ChromosomeHaplotype>): SetVersionAction {
        return { type: 'SET_VERSION', version };
    },
    setConfidence(confidence: keyof (
        ComputedDataV5Entry<ChromosomeHaplotype> & 
        ComputedDataV7Entry<ChromosomeHaplotype>
    )): SetConfidenceAction {
        return { type: 'SET_CONFIDENCE', confidence };
    },
    setHighlight(highlight: string): SetHighlightAction {
        return { type: 'SET_HIGHLIGHT', highlight };
    },
    setSampleData(): SetSampleDataAction {
        return { type: 'SET_SAMPLE_DATA' };
    },
    clearData(): ClearDataAction {
        return { type: 'CLEAR_DATA' };
    }
};

export default contextActions;