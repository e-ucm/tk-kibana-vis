import 'plugins/e-ucm/tk-widget-vis.less';
import 'plugins/e-ucm/tk-widget-controller';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import tKWidgetVisTemplate from 'plugins/e-ucm/tk-widget.html';
import tKWidgetParamsTemplate from 'plugins/e-ucm/tk-widget-params.html';

// register the provider with the visTypes registry
require('ui/registry/vis_types').register(tkWidgetVisProvider);

function tkWidgetVisProvider(Private) {
    const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
    const Schemas = Private(VisSchemasProvider);

    return new TemplateVisType({
        name: 'tkWidget',
        title: 'Thomas Kilmann Classification widget',
        icon: 'fa-spinner',
        description: 'This is Kibana 5 plugin which uses the JavaScript to display Thomas Kilmann Classification visualization.',
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
export default tkWidgetVisProvider;
