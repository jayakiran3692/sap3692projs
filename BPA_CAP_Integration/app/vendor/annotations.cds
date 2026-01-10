using VendorService as service from '../../srv/service';
annotate service.vendor with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'VendorID',
                Value : VendorID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : Name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Amount',
                Value : Amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SubmittedBy',
                Value : SubmittedBy,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'VendorID',
            Value : VendorID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : Name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Amount',
            Value : Amount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'SubmittedBy',
            Value : SubmittedBy,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'VendorService.trigger',
            Label : 'trigger',
            Inline : true,
        },
    ],
);

