const OrganViewHeader = ({ organ }) => {
    return (
        <div style={{ width: '100%' }}>
            {/* Title */}
            <h4>Organ</h4>
            <h3>{organ.term}</h3>

            {/* Badges */}
            {organ.organUberonUrl && (
                <div className='row mb-2' style={{ minHeight: '38px' }}>
                    <div className='col-md-6 col-sm-12 entity_subtitle icon_inline'>
                        <h5 className='title_badge'>
                            <span className='badge bg-secondary'>
                                <a
                                    // href={organ.uberonUrl}
                                    href={organ.organUberonUrl}
                                    className='icon_inline text-white'
                                >
                                    {organ.organUberon}
                                </a>
                                &nbsp;
                                <i className='bi bi-box-arrow-up-right lnk--white'></i>
                            </span>
                        </h5>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrganViewHeader
