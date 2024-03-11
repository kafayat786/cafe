import { useField } from 'formik';
import ReactSelect from 'react-select';

function Select(props) {
    const [field] = useField(props.name);
    console.log(props);
    return (
        <div>
            <ReactSelect
                options={props.options}
                name={field.name}
                value={field.name}
                classNamePrefix="custom_select" // class prefix for customization
                onChange={({ value }) => {
                    field.onChange({
                        target: {
                            name: field.name,
                            value: value
                        }
                    });
                }}
            />
        </div>
    );
}

export default Select;
