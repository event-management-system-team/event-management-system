import { getResourceConfig } from '../../../../../utils/resource.utils'
import ResourceCard from './ResourceCard';
const MainContent = ({ filteredResources }) => {

    return (
        <>
            <div className="text-right px-2 border-b border-slate-200/80 mb-8 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">
                    {filteredResources.length} Resources
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-300">

                {filteredResources.map((resource) => {
                    const config = getResourceConfig(resource.fileType);
                    const IconComp = config.icon;
                    const ActionIcon = config.actionIcon;

                    return (
                        <ResourceCard key={resource.resourceId}
                            resource={resource}
                            IconComp={IconComp}
                            ActionIcon={ActionIcon}
                            config={config} />
                    );
                })}

            </div>
        </>
    )
}

export default MainContent
