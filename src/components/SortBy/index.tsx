import {ReactComponent as SortUpIcon} from "../../assets/icons/sortup.svg";
import {ReactComponent as SortDownIcon} from "../../assets/icons/sortdown.svg";
export const SortBy=()=>{
    return(
        <div className="flex items-center gap-2">
            <div>
                <SortUpIcon />
                <div className="h-1 bg-header-pink" />
                <SortDownIcon />
            </div>
            <span className="text-purple-100">
                Sort by:
            </span>
            <span className="text-purple-200">
                Distance
            </span>
        </div>
    );
}