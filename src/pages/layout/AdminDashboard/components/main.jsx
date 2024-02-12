export default function Main(props){
    return(
    <main className='bg_color_2'>
        <h3 className='titre_page'>{props.titrePage}</h3>
        <div className="main_content">
            {props.showPage}
        </div>
    </main>
    )
}