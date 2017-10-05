import 'plugins/tk-kibana-vis/tk-widget-vis.less';
import 'plugins/tk-kibana-vis/tk-widget-controller';
import { VisSchemasProvider } from 'ui/vis/schemas';
import tKWidgetVisTemplate from 'plugins/tk-kibana-vis/tk-widget.html';
import tKWidgetParamsTemplate from 'plugins/tk-kibana-vis/tk-widget-params.html';
import { VisVisTypeProvider } from 'ui/vis/vis_type';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
// register the provider with the visTypes registry
VisTypesRegistryProvider.register(tkWidgetVisProvider);

function tkWidgetVisProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);
    const VisType = Private(VisVisTypeProvider);

    return new TemplateVisType({
        name: 'tkWidget',
        title: 'Thomas Kilmann Classification widget',
        icon: 'fa-spinner',
        description: 'This is Kibana 5 plugin which uses the JavaScript to display Thomas Kilmann Classification visualization.',
        category: VisType.CATEGORY.OTHER,
        template: tKWidgetVisTemplate,
        params: {
            defaults: {
                color1: '#1f77b4',
                color2: '#ff7f0e',
                color3: '#2ca02c',
                color4: '#d62728',
                color5: '#9467bd',
                legend_position: "right"
            },
            editor: tKWidgetParamsTemplate
        },
        schemas: new Schemas([
            {
                group: 'metrics',
                name: 'metric',
                title: 'Y-axis metric',
                min: 1,
                max: 5,
                defaults: [{type: 'count', schema: 'metric'}],
            },
            {
                group: 'buckets',
                name: 'buckets',
                title: 'X-Axis',
                min: 1,
                max: 1,
                aggFilter: ['!geohash_grid']
            }
        ])
    });
}

// export the provider so that the visType can be required with Private()
// export default tkWidgetVisProvider;
