import { SubmitHandler, useForm } from "react-hook-form";
import { collectKeywords } from "../../recipie-import/keywords";

const corsAnywhereHost = "http://45.79.237.196:9998";

type Input = { url: string; };

function ImportFromSitePage() {

    // form stuff
    const { handleSubmit, register} = useForm<Input>();

    const onSubmit: SubmitHandler<Input> = data => {
        console.log(data)
        fetch(`${corsAnywhereHost}/${data.url}`)
            .then(res => {
                if (res.ok) {
                    return res.text();
                }
                else {
                    console.error("bad status", res.status, res.statusText);
                }
            })
            .then(text => {
                if (!text) {
                    console.error("no body");
                    return;
                }
                collectKeywords(text);
            })
            .catch(err => console.error("err", err));
    };

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register("url")} style={{width: "100%"}} />
            <input type="submit" />
        </form>
    </div>;
}

export default ImportFromSitePage;
